import * as React from 'react';

type ComponentProps = {

};

const MainContent: React.FunctionComponent<ComponentProps> = (props) => {
	return (
		<div style={{
			fontSize: "16pt",
			paddingTop: "1em",
			paddingBottom: "1em"
		}}>
			{props.children}
		</div>
	);
}

export default MainContent;