import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import React from "react";

export default function SmartBreadcrumb({ pathname, pageTitle }: { pathname: string; pageTitle: string | undefined }) {
	const segments = pathname.split("/");
	return (
		<Breadcrumb className="mt-1 ml-[2px] -mb-4">
			<BreadcrumbList className="font-mono text-xs">
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
								<BreadcrumbLink 
									href={href}
									className={isLast ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
								>
									{label}
								</BreadcrumbLink>
							</BreadcrumbItem>
							{!isLast && <BreadcrumbSeparator />}
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
