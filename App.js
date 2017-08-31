import React from 'react';
import { AppLoading } from 'expo';
import { StyleProvider } from 'native-base/src';
import { Provider } from 'react-redux';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';
import store from './src/data/store';
import App from './src/App';

export default class Base extends React.Component {
    state = {
        isReady: false
    };

    async componentWillMount() {
        await Expo.Font.loadAsync({
            Roboto: require('native-base/Fonts/Roboto.ttf'),
            Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
            Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf')
        });

        this.setState({ isReady: true });
    }

    render() {
        if (!this.state.isReady) {
            return <AppLoading/>;
        }
        return (
            <Provider store={store}>
                <StyleProvider style={getTheme(commonColor)}>
                    <App/>
                </StyleProvider>
            </Provider>
        );
    }
}
