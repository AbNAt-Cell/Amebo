-- Enable pgvector extension
create extension if not exists vector;

-- Create profiles table if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  subscription_tier text default 'free',
  ai_usage_count int default 0,
  ai_usage_reset_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Safely add columns to profiles if they might be missing (handling existing table case)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'subscription_tier') then
    alter table public.profiles add column subscription_tier text default 'free';
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'ai_usage_count') then
    alter table public.profiles add column ai_usage_count int default 0;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'ai_usage_reset_at') then
    alter table public.profiles add column ai_usage_reset_at timestamp with time zone default now();
  end if;
end $$;

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Re-create policies for profiles
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- Trigger for new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid error on recreation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create folders table
create table if not exists public.folders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  color text,
  parent_id uuid references public.folders(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS for folders
alter table public.folders enable row level security;

-- Re-create policies for folders
drop policy if exists "Users can view their own folders" on public.folders;
create policy "Users can view their own folders" 
  on public.folders for select 
  using (auth.uid() = user_id);

drop policy if exists "Users can check insert folders" on public.folders;
create policy "Users can check insert folders" 
  on public.folders for insert 
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own folders" on public.folders;
create policy "Users can update their own folders" 
  on public.folders for update 
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own folders" on public.folders;
create policy "Users can delete their own folders" 
  on public.folders for delete 
  using (auth.uid() = user_id);

-- Create notes table
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text,
  summary text,
  folder_id uuid references public.folders(id) on delete set null,
  is_archived boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS for notes
alter table public.notes enable row level security;

-- Re-create policies for notes
drop policy if exists "Users can view their own notes" on public.notes;
create policy "Users can view their own notes" 
  on public.notes for select 
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own notes" on public.notes;
create policy "Users can insert their own notes" 
  on public.notes for insert 
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own notes" on public.notes;
create policy "Users can update their own notes" 
  on public.notes for update 
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own notes" on public.notes;
create policy "Users can delete their own notes" 
  on public.notes for delete 
  using (auth.uid() = user_id);

-- Create tags table
create table if not exists public.tags (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  color text,
  created_at timestamp with time zone default now()
);

-- Enable RLS for tags
alter table public.tags enable row level security;

-- Re-create policies for tags
drop policy if exists "Users can view their own tags" on public.tags;
create policy "Users can view their own tags" 
  on public.tags for select 
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own tags" on public.tags;
create policy "Users can insert their own tags" 
  on public.tags for insert 
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own tags" on public.tags;
create policy "Users can update their own tags" 
  on public.tags for update 
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own tags" on public.tags;
create policy "Users can delete their own tags" 
  on public.tags for delete 
  using (auth.uid() = user_id);

-- Create note_tags junction table
create table if not exists public.note_tags (
  note_id uuid references public.notes(id) on delete cascade not null,
  tag_id uuid references public.tags(id) on delete cascade not null,
  primary key (note_id, tag_id)
);

-- Enable RLS for note_tags
alter table public.note_tags enable row level security;

-- Re-create policies for note_tags
drop policy if exists "Users can view their own note_tags" on public.note_tags;
create policy "Users can view their own note_tags" 
  on public.note_tags for select 
  using (
    exists (
      select 1 from public.notes 
      where id = note_tags.note_id 
      and user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert their own note_tags" on public.note_tags;
create policy "Users can insert their own note_tags" 
  on public.note_tags for insert 
  with check (
    exists (
      select 1 from public.notes 
      where id = note_tags.note_id 
      and user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete their own note_tags" on public.note_tags;
create policy "Users can delete their own note_tags" 
  on public.note_tags for delete 
  using (
    exists (
      select 1 from public.notes 
      where id = note_tags.note_id 
      and user_id = auth.uid()
    )
  );

-- Create note_embeddings table
create table if not exists public.note_embeddings (
  note_id uuid references public.notes(id) on delete cascade primary key,
  embedding vector(1536), -- OpenAI embedding size
  updated_at timestamp with time zone default now()
);

-- Enable RLS for embeddings
alter table public.note_embeddings enable row level security;

-- Re-create policies for embeddings
drop policy if exists "Users can view their own embeddings" on public.note_embeddings;
create policy "Users can view their own embeddings" 
  on public.note_embeddings for select 
  using (
    exists (
      select 1 from public.notes 
      where id = note_embeddings.note_id 
      and user_id = auth.uid()
    )
  );

-- Similarity search function
create or replace function match_notes(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  title text,
  similarity float
)
language plpgsql stable
as $$
begin
  return query (
    select
      notes.id,
      notes.content,
      notes.title,
      1 - (note_embeddings.embedding <=> query_embedding) as similarity
    from note_embeddings
    join notes on notes.id = note_embeddings.note_id
    where 1 - (note_embeddings.embedding <=> query_embedding) > match_threshold
    and notes.user_id = auth.uid()
    order by note_embeddings.embedding <=> query_embedding
    limit match_count
  );
end;
$$;
