import * as React from 'react';
import { HooxProvider } from 'toomanyhoox';

import { store } from './data/store';

import Condorcet from './components/condorcet';

type ComponentProps = {

};

const App: React.SFC<ComponentProps> = (props) => (
	<HooxProvider store={store}>
		<Condorcet />
	</HooxProvider>
)

export default App;