import * as React from 'react';

export default function useHover<T extends HTMLElement>(): [React.RefObject<T>, boolean] {
	const hoverRef = React.useRef<T>(null);
	const [isHovered, setIsHovered] = React.useState<boolean>(false);

	const onMouseOver = () => setIsHovered(true);
	const onMouseOut = () => setIsHovered(false);

	React.useEffect(() => {
		const node = hoverRef.current

		if (!node)
			return;

		node.addEventListener('mouseover', onMouseOver);
		node.addEventListener('mouseout', onMouseOut);

		return () => {
			node.removeEventListener('mouseover', onMouseOver);
			node.removeEventListener('mouseout', onMouseOut);
		}
	}, [hoverRef.current]);

	return [hoverRef, isHovered];
}