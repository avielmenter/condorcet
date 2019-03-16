import * as React from 'react';

type ComponentProps = {

}

const StageHeader: React.FunctionComponent<ComponentProps> = (props) => {
	return (
		<div style={{
			textAlign: "center",
			marginLeft: "auto",
			marginRight: "auto",
			marginBottom: "0.5em",
		}}>
			<h2 style={{
				display: "inline-block",
				width: "calc(100% - 1in)",
				paddingBottom: "0.25em",
				borderBottom: "1px solid var(--shiny-shamrock)"
			}}>
				{props.children}
			</h2>
		</div>
	)
}

export default StageHeader;