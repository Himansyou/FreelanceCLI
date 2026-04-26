export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-8 py-4 w-full sticky top-0 z-40 bg-[rgba(14,14,14,0.8)] dark:bg-[rgba(14,14,14,0.8)] rounded-b-[2rem] backdrop-blur-md">
      <div className="flex items-center bg-surface-container-highest rounded-2xl px-4 py-2 w-96 transition-all focus-within:ring-1 focus-within:ring-primary/30">
        <span className="material-symbols-outlined text-on-surface-variant mr-3" data-icon="search">search</span>
        <input 
          className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface outline-none" 
          placeholder="Search sessions..." 
          type="text"
        />
      </div>
      <div />
    </header>
  );
}
