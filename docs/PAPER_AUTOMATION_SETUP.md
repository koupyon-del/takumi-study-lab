# Study Lab v3.6: private paper-evidence inbox

## Purpose

Keep all existing \`study_state\` and cloud learning history unchanged. Move new
paper-assessment deliveries to a **private** additive \`paper_evidence_inbox\`
table rather than putting grades in the public GitHub Pages repository.

## Deployment (NOT automatically applied by a GitHub Pages release)

1. Confirm the **existing** Study Lab Supabase project. Do not recreate a project.
2. In that project's Supabase SQL editor or connected administrative tool, review
   and apply \`supabase/migrations/20261030231500_paper_evidence_inbox.sql\`.
   It only creates a new table, index, grants and RLS policies. There is **no**
   change to \`study_state\`.
3. Connect an authorized trusted **server-side** writer (e.g., an approved
   ChatGPT ↔ Supabase management integration) with permission to insert into
   \`public.paper_evidence_inbox\`. Do **not** publish the database service-role
   key in GitHub Pages, HTML, an URL, or ChatGPT conversation.
4. Identify the correct destination \`user_id\` in the existing
   \`study_state\` table using an authorized admin connection. Do not guess an
   account ID or copy a generic example ID.
5. Insert only validated \`takumi-study-lab-paper-v1\` payloads with a stable
   \`batch_key\` (idempotent on \`user_id,batch_key\`). Set
   \`review_status='parent_verified'\` **only if the parent has actually
   verified the paper answers**. Otherwise use \`needs_parent_review\`.
6. Open Study Lab, sign in with the established account, and visit "紙教材".
   The client automatically checks for new entries after cloud login and
   periodically while the page is visible. Verified entries are imported
   automatically, while other entries await parent confirmation.

## Server-only insert template

Run exclusively through an authorized Supabase administrator. Bind parameters
rather than concatenating untrusted assessment text in dynamic SQL.

\`\`\`sql
insert into public.paper_evidence_inbox
 (user_id,batch_key,payload,review_status)
values
 (
   :verified_existing_study_state_user_id,
   :stable_unique_batch_key,
   :validated_paper_payload::jsonb,
   :review_status
 )
on conflict (user_id,batch_key) do nothing;
\`\`\`

Sample input shape (illustration only, no real learner information):

\`\`\`json
{
  "schema": "takumi-study-lab-paper-v1",
  "sourceDate": "2026-10-30",
  "title": "保護者確認済み紙教材",
  "subjects": {
    "math": {"連立方程式": "×", "1次不等式": "△"}
  }
}
\`\`\`

## Reliability and security

- \`anon\` cannot view or change the inbox; \`authenticated\` may select only
  their own records and update only the acknowledgement timestamps.
- The browser cannot insert grade payloads into this table. The new table
  is not the legacy \`study_state\` table.
- The application acknowledges each row **only after** the evidence journal
  entry is confirmed inside the synced cloud \`study_state\` object. On
  network failure the inbox row remains pending for retry.
- Existing trust journal batch IDs prevent duplicate grading. Earlier-dated
  evidence cannot overwrite a later-dated verified grade.
- User-facing review remains mandatory for \`needs_parent_review\`.
- Before the migration is deployed, the page clearly reports that the
  auto-inbox server setup is still missing. Legacy share links and local
  paper imports continue to work.
- This is *not* a guarantee that a ChatGPT app connector is already installed.
  GitHub Pages deployment and database schema application are separate steps.
  The ChatGPT-to-database writer is not live until the administrator confirms it.

## Verification

\`\`\`sh
node paper-link-v1.test.cjs
node paper-inbox-v1.test.cjs
node lesson-continuity-v6.test.cjs
\`\`\`

Also verify actual Android/iOS sign-in and remote inbox intake after
applying the SQL migration. Automated tests do not substitute for the live
Supabase deployment check.
