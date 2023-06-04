
export default function Home() {

    return(
        <div>
            <h1 className="py-24 px-4 border-0 rounded-xl bg-gradient-to-r from-blue-100 to-emerald-100">
                Exchange your ideas with <span className="inline-block px-4 py-2 rounded-xl font-black bg-gradient-to-r from-blue-50 to-emerald-50">idealy</span>.
            </h1>

            <SectionHeading>What is <AppName>idealy?</AppName></SectionHeading>

            <p className="my-4">
                <AppName>Idealy</AppName> is a social media web app similar to Twitter and Facebook. It was made by <a href="https://joshkaye.dev" className="text-blue-500 underline">Josh</a> as a portfolio project. View the repo on <a href="https://github.com/kaye360/firebase-twitter-clone" className="text-blue-500 underline">GitHub</a>.
            </p>

            <p className="my-2">
                The technologies used to create <AppName>idealy</AppName> include:
            </p>

            <ul className="flex gap-2">
                <ListItem>React</ListItem>
                <ListItem>Typescript</ListItem>
                <ListItem>Firebase</ListItem>
                <ListItem>Tailwind</ListItem>
                <ListItem>Framer Motion</ListItem>
                <ListItem>Netlify</ListItem>
            </ul>

            <SectionHeading>What can <AppName>idealy</AppName> do?</SectionHeading>

            <p className="my-2">
                <AppName>Idealy</AppName> has the following features:
            </p>

            <ul className="grid gap-2 pl-6 ">
                <li className="list-disc">User sign up and authentication with Google Firebase</li>
                <li className="list-disc">Create and view posts, and repost other posts</li>
                <li className="list-disc">Like and comment on posts</li>
                <li className="list-disc">Notifications for user interactions</li>
                <li className="list-disc">Hashtags to find other similar posts</li>
                <li className="list-disc">Customize user handles and profile info</li>
                <li className="list-disc">Continous deployment with Netlify hosting</li>
                <li className="list-disc">Responsive Tailwindcss user interface</li>
                {/* <li className="list-disc"></li> */}
            </ul>

        </div>
    )
}



function SectionHeading({children} : {children : any}) {
    return(
        <h2 className="mt-10 mb-4 border-b">{children}</h2>
    )
}


function ListItem({children} : {children : any}) {
    return(
        <li className="px-3 py-1 rounded-md border border-slate-300 text-slate-500">
            {children}
        </li>
    )
}


function AppName({children} : {children : any}) {
    return (
        <span className="text-blue-500 font-bold">{children}</span>
    )
}