import {Button} from '@/components/ui/button'

export default function Header() {
    return (
        <div className="header">
            <div className="flex flex-row-reverse h-full mx-5 gap-5 items-center">
                <Button variant="outline">
                    sign-up
                </Button>
                <Button
                    variant="default">
                    login
                </Button>
            </div>
        </div>
    )
}