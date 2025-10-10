```sql
do $$
begin
  begin
    perform storage.create_bucket('avatars', true);
  exception
    when undefined_function then
      insert into storage.buckets (id, name, public)
      values ('avatars', 'avatars', true)
      on conflict (id) do update set public = excluded.public;
  end;
end$$;

drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read"
on storage.objects for select
to public
using (bucket_id = 'avatars');

drop policy if exists "avatars insert own" on storage.objects;
create policy "avatars insert own"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (owner = auth.uid() or split_part(name,'/',1) = auth.uid()::text)
);

drop policy if exists "avatars update own" on storage.objects;
create policy "avatars update own"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and (owner = auth.uid() or split_part(name,'/',1) = auth.uid()::text)
)
with check (
  bucket_id = 'avatars'
  and (owner = auth.uid() or split_part(name,'/',1) = auth.uid()::text)
);

drop policy if exists "avatars delete own" on storage.objects;
create policy "avatars delete own"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (owner = auth.uid() or split_part(name,'/',1) = auth.uid()::text)
);
```
