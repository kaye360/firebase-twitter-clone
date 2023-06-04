
export function PostCardLoader() {
    return (
        <div className="flex flex-col gap-2 w-full bg-blue-50 p-4 rounded-xl animate-pulse">

            <div className="flex justify-between">

                <div className="flex items-center gap-2 w-1/2">
                    <span className="block rounded-full h-8 w-8 bg-blue-100"></span>
                    <span className='block rounded-lg h-6 w-full bg-blue-100'></span>
                </div>

                <div className='bg-blue-100 w-16 h-8 rounded-lg'></div>

            </div>

            <span className='block mb-4 rounded-lg h-4 w-1/3 bg-blue-100'></span>

            <span className='block rounded-lg h-4 w-full bg-blue-100'></span>
            <span className='block rounded-lg h-4 w-full bg-blue-100'></span>
            <span className='block rounded-lg h-4 w-2/3 bg-blue-100'></span>

            <span className='block mt-8 rounded-lg h-4 w-full bg-blue-100'></span>

        </div>
    )
}
