#### NOTES

1. [Cara kerja getSession() dan onAuthStateChange()](md/auth.md)
2. [Cara Kerja Kanban dari Shadcn UI + Supabase](md/kanban.md)
3. [Config AI: Untuk Suggestion Content Task](md/configAI.md)
4. [Config Buncket: Untuk Setting Policy Supabase](md/configBucket.md)
5. [Config Img: Untuk upload gambar di NextJS](md/configImg.md)

## BUG

1. Bagian Kanban ganti pake dnd.kit karena:

- kanban yang dari shadcn suka ga update ke db
- susah di style alias deskripsi dll ga bisa di munculin karena style default
- pas nampilin list task dia bukan sistem looping alias langsung nerima props

2. Si AI ganti dari Open AI ke Gemini karena API Keynya di akun aku ga jalan (yang di .env itu key punya si Richard)
