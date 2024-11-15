import type { Metadata } from "next";
import ResumePageComponent from "@/components/page/ResumePageComponent";

export const metadata: Metadata = {
	title: "Resume | Paul Serbanescu",
};

export default function Resume() {
	return <ResumePageComponent />;
}
