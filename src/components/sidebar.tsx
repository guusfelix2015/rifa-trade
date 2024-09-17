
export const Sidebar = () => {
  return (
    <aside className="desktop-transparent hidden w-12 flex-col border-r border-gray-100 bg-gray-50 md:flex lg:w-64 lg:flex-shrink-0 lg:px-4">
      <div className="flex h-0 flex-1 flex-col overflow-y-auto pt-3 pb-4 lg:pt-5">
        <div className="mb-4 flex justify-center lg:mb-2 lg:justify-start">
          <div>
            <h1 className="mt-4 text-3xl font-semibold">Rifa<span className="text-primary">Trade</span></h1>
          </div>
        </div>

        <nav className="flex flex-1 flex-col space-y-1.5 md:px-2 lg:mt-5 lg:px-0">
          <h1>item</h1>
          <h1>item</h1>

        </nav>
      </div>
    </aside>
  )
}
