import {SyncLoader} from "react-spinners";

export const PageSpinner = () => {
    return (
        <div className="absolute w-full h-full top-0 bg-gray-50 opacity-50 z-50 flex justify-center items-center">
            <SyncLoader color={"gray"} size={10} aria-label="Loading Spinner" data-testid="loader"/>
        </div>
    )
}