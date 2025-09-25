import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import React from "react";

export default function SmartBreadcrumb({ pathname, pageTitle }: { pathname: string; pageTitle: string | undefined }) {
	const segments = pathname.split("/");
	return (
		<Breadcrumb className="py-2 mt-2">
			<BreadcrumbList>
				{segments.map((segment: string, index: number) => {
					const href = segment.length > 1 ? `/${segment}` : "/";
					let label = segment.length > 1 ? segment.charAt(0).toUpperCase() + segment.slice(1) : "Home";
					const isLast = index === segments.length - 1;
					if (isLast) {
						label = pageTitle || label;
					}

					return (
						<React.Fragment key={index}>
							<BreadcrumbItem>
								<BreadcrumbLink href={href}>{label}</BreadcrumbLink>
							</BreadcrumbItem>
							{/* only <BreadcrumbSeparator /> if not the last item in list */}
							{!isLast && <BreadcrumbSeparator />}
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
