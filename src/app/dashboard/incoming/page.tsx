import AddIncomingDialog from "./components/AddIncomingDialog";
import { Metadata } from "next";
import IncomingList from "./components/IncomingList";
import IncomingListWrapper from "./components/IncomingListWrapper";

export const metadata: Metadata = {
  title: "Incoming",
  description: "Incoming page",
};

export default async function IncomingPage() {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <IncomingListWrapper>
        <div className="w-full p-2 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Incoming</h1>
          </div>
          <div>
            <AddIncomingDialog />
          </div>
        </div>
        <IncomingList />
      </IncomingListWrapper>
    </div>
  );
}
