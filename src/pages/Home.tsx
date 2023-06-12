import { useContext, useState } from "react"
import QuarkLogo from "../components/QuarkSvgLogo"
import ValidatedForm from "../components/ValidatedForm/components/ValidatedForm"
import ValidatedInput from "../components/ValidatedForm/components/ValidatedInput"
import ValidatorRules from "../components/ValidatedForm/utils/ValidatorRules"
import { AppContext } from "../App"
import Button from "../components/Button"
import SubmitErrorMessage from "../components/ValidatedForm/components/SubmitErrorMessage"

export default function Home() {

    const [field1, setField1] = useState<string>('')
    const [field2, setField2] = useState<string>('')
    const [field3, setField3] = useState<string>('')

    const appContext = useContext(AppContext)
    const [currentUser] = useState(appContext?.userHandle)

    const handles = ['one', 'two', 'three', 'four', ]

    function handleSubmit() {
        console.log('submitted successfully')
    }

    return(
    <>

        <ValidatedForm 
            handleSubmit={handleSubmit}
            rules={{auth : true}}
        >

            <label>
                <div>Field 1</div>
                <ValidatedInput
                    type="text"
                    title="Field1"
                    value={field1}
                    setValue={setField1}
                    rules={{minLength : 10}}
                />
            </label>

            <label>
                <div>Field 2</div>
                <ValidatedInput
                    type="text"
                    title="Field2"
                    value={field2}
                    setValue={setField2}
                    rules={{
                        required : true,
                        allowableChars : { 
                            regex : ValidatorRules.regexHashTag, 
                            chars : 'letters, numbers, and hyphens (-)'
                        }
                    }}
                />
            </label>

            <label>
                <div>Field 3</div>
                <ValidatedInput
                    type="text"
                    title="Field3"
                    value={field3}
                    setValue={setField3}
                    rules={{
                        maxLength : 10,
                        required : true,
                        allowableChars : {
                            regex : ValidatorRules.regexUserHandle,
                            chars : 'letters, numbers, - _',
                        },
                        unique : {
                            all : handles,
                            current : currentUser as string
                        }
                    }}
                />
            </label>

            <SubmitErrorMessage />

            <Button type="submit">
                Submit
            </Button>

        </ValidatedForm>

        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <div className="animate-bounce-up-in pb-12">
            <h1 className="relative block py-12 md:py-24 px-4 border-0 rounded-xl bg-gradient-to-r from-blue-100 to-emerald-100 text-center md:text-left overflow-hidden text-blue-700">

                <p className="relative z-10">
                    Exchange your ideas with <span className="inline-block px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-rose-300 to-orange-300 text-white">Quark</span>
                </p>

                <p className="text-lg max-w-[30ch]">
                    Microblogging Redefined, One Quantum Leap at a Time
                </p>

                <QuarkLogo className='absolute top-1/2 left-3/4 z-0 -translate-y-1/2 scale-[10] blur-[0.4px] opacity-10' />
                <QuarkLogo className='absolute top-4 left-12 z-0 -translate-y-1/2 scale-[2] blur-[0.4px] opacity-10' />
                <QuarkLogo className='absolute bottom-4 left-[15%] z-0 -translate-y-1/2 scale-[4] blur-[0.4px] opacity-10' />
            </h1>

            <SectionHeading>What is <AppName>Quark?</AppName></SectionHeading>

            <p className="my-4">
                <AppName>Quark</AppName> is a social media web app similar to Twitter and Facebook. It was made by <a href="https://joshkaye.dev" className="text-blue-500 underline">Josh</a> as a portfolio project. View the repo on <a href="https://github.com/kaye360/firebase-twitter-clone" className="text-blue-500 underline">GitHub</a>.
            </p>

            <p className="my-2">
                The technologies used to create <AppName>Quark</AppName> include:
            </p>

            <ul className="flex gap-2 flex-wrap">
                <ListItem>React</ListItem>
                <ListItem>Typescript</ListItem>
                <ListItem>Firebase</ListItem>
                <ListItem>Tailwind</ListItem>
                <ListItem>Framer Motion</ListItem>
                <ListItem>Netlify</ListItem>
            </ul>

            <SectionHeading>What can <AppName>Quark</AppName> do?</SectionHeading>

            <p className="my-2">
                <AppName>Quark</AppName> has the following features:
            </p>

            <ul className="grid gap-2 pl-6 ">
                <li className="list-disc">User sign up and authentication with Google Firebase</li>
                <li className="list-disc">Create and view posts, and repost other posts</li>
                <li className="list-disc">Like and comment on posts</li>
                <li className="list-disc">Notifications for user interactions</li>
                <li className="list-disc">Hashtags and search to find other similar posts</li>
                <li className="list-disc">Customize user handles and profile info</li>
                <li className="list-disc">Continous deployment with Netlify hosting</li>
                <li className="list-disc">Responsive Tailwindcss user interface</li>
            </ul>

        </div>
    </>
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