"use client"


const NotFound = () => {
  return (
    <div>
      <h1 className='text-center text-3xl font-semibold tracking-tight mt-10'>404 not found</h1>
      <button className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 block mx-auto mt-10" onClick={() => window.history.back()}>Go Back</button>
      
    </div>
  )
}

export default NotFound