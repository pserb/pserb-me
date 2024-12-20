import FlutedGlass from "@/components/ui/fluted-glass";
import { WinButton } from "@/components/ui/win-button";

export default function Test() {
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Test</h1>
            <hr />
            <p>
                This is body text
            </p>
            <div className="flex flex-col space-y-8">
                <WinButton variant={"default"} shadow={"solid"}>Test Button</WinButton>
                <WinButton variant={"default"} shadow={"stippled"}>Test Button</WinButton>
                <WinButton variant={"default"} shadow={"striped"}>Test Button</WinButton>
            </div>
            <div className="w-full h-[80px]">
                <FlutedGlass type="fluted" angle={90} className="absolute inset-0" rounded={false} border={true}>
                    <div className="flex items-center h-full space-x-8 ml-8">
                        <WinButton variant={"default"} shadow={"solid"}>Test Button</WinButton>
                        <WinButton variant={"destructive"}>Test Button</WinButton>
                        {/* <WinButton variant={"ghost"}>Test Button</WinButton> */}
                    </div>
                </FlutedGlass>
            </div>
        </div>
    )
}