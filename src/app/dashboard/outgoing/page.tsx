import AddOutgoingDialog from "./components/AddOutgoingDialog";
import { Metadata } from "next";
import OutgoingList from "./components/OutgoingList";
import OutgoingListWrapper from "./components/OutgoingListWrapper";

export const metadata: Metadata = {
  title: "Outgoing",
  description: "Outgoing page",
};

export default async function OutgoingPage() {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <OutgoingListWrapper>
        <div className="w-full p-2 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Outgoing</h1>
          </div>
          <div>
            <AddOutgoingDialog />
          </div>
        </div>
        <OutgoingList />
      </OutgoingListWrapper>
    </div>
  );
}
