-- Policies required for Favorites feature in Expresate.
-- Safe to run multiple times.

-- Ensure RLS is enabled
alter table if exists public.favorite_pictograms enable row level security;
alter table if exists public.pictograms enable row level security;

-- Ensure authenticated role can operate on favorites table
grant select, insert, delete on table public.favorite_pictograms to authenticated;

-- Optional but useful for joined reads from favorite_pictograms -> pictograms(*)
grant select on table public.pictograms to authenticated;

-- Replace existing policies for favorites

drop policy if exists favorite_pictograms_select_linked on public.favorite_pictograms;
drop policy if exists favorite_pictograms_insert_linked on public.favorite_pictograms;
drop policy if exists favorite_pictograms_delete_linked on public.favorite_pictograms;

-- Read favorites for profiles linked to current authenticated user
create policy favorite_pictograms_select_linked on public.favorite_pictograms
for select to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.profile_id = favorite_pictograms.profile_id
      and up.user_id = auth.uid()
  )
);

-- Insert favorites only for profiles linked to current authenticated user
create policy favorite_pictograms_insert_linked on public.favorite_pictograms
for insert to authenticated
with check (
  exists (
    select 1
    from public.user_profiles up
    where up.profile_id = favorite_pictograms.profile_id
      and up.user_id = auth.uid()
  )
);

-- Delete favorites only for profiles linked to current authenticated user
create policy favorite_pictograms_delete_linked on public.favorite_pictograms
for delete to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.profile_id = favorite_pictograms.profile_id
      and up.user_id = auth.uid()
  )
);

-- Ensure pictograms can be read by authenticated users
-- (needed when selecting favorite_pictograms with pictograms(*) join)
drop policy if exists pictograms_read_all on public.pictograms;
create policy pictograms_read_all on public.pictograms
for select to authenticated
using (true);
