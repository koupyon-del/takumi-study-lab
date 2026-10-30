-- Study Lab verified paper-evidence inbox.
-- Additive migration: does not change study_state or existing learning history.
-- Only a trusted Supabase administrative integration can INSERT.
-- Signed-in learners can view and acknowledge only their own entries.
create table if not exists public.paper_evidence_inbox (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  batch_key text not null check (char_length(batch_key) between 8 and 128),
  payload jsonb not null check (
    jsonb_typeof(payload) = 'object'
    and octet_length(payload::text) <= 16384
  ),
  review_status text not null default 'needs_parent_review'
    check (review_status in ('needs_parent_review', 'parent_verified')),
  created_at timestamptz not null default now(),
  applied_at timestamptz,
  dismissed_at timestamptz,
  constraint paper_evidence_inbox_user_batch_unique unique(user_id, batch_key),
  constraint paper_evidence_inbox_ack_exclusive check
    (applied_at is null or dismissed_at is null)
);
create index if not exists paper_evidence_inbox_pending
  on public.paper_evidence_inbox (user_id, created_at)
  where applied_at is null and dismissed_at is null;

alter table public.paper_evidence_inbox enable row level security;
-- On legacy Supabase projects new tables may be granted public API access
-- automatically. Revoke BEFORE granting the minimal required privileges.
revoke all on table public.paper_evidence_inbox from public, anon, authenticated;
grant select on table public.paper_evidence_inbox to authenticated;
grant update(applied_at, dismissed_at) on table public.paper_evidence_inbox to authenticated;
grant all on table public.paper_evidence_inbox to service_role;

drop policy if exists "study_lab_paper_read_own" on public.paper_evidence_inbox;
create policy "study_lab_paper_read_own"
  on public.paper_evidence_inbox for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists "study_lab_paper_ack_own" on public.paper_evidence_inbox;
create policy "study_lab_paper_ack_own"
  on public.paper_evidence_inbox for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

comment on table public.paper_evidence_inbox is
'Private, append-only source of tutor-reviewed paper evidence. Only service_role inserts. Learners can acknowledge their own records; existing study_state records are untouched.';
