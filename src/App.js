import React from 'react';
import {
    StyleSheet
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import {
    StyleProvider,
    Container,
    Content,
    H1, H2, H3,
    Text,
    Button
} from 'native-base';
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/platform';
import Login from './Login';
import Demo from './Demo';
import StarWars from './StarWars';
import Person from './Person';

class App extends React.Component {
    static navigationOptions = {
        title: 'React Native Rockstarter'
    };

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            isLoading: true
        };
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <Container>
                <Content contentContainerStyle={styles.container}>
                    <H1>Welcome</H1>
                    <H2>to the</H2>
                    <H3>React Native Rockstarter</H3>
                    <Button danger style={styles.buttonContainer}
                            onPress={() => navigate('Login')}
                    >
                        <Text>Login</Text>
                    </Button>
                    <Button primary style={styles.buttonContainer}
                            onPress={() => navigate('Demo')}
                    >
                        <Text>Demo</Text>
                    </Button>
                    <Button info style={styles.buttonContainer}
                            onPress={() => navigate('StarWars', { endpoint: 'people' })}
                    >
                        <Text>Star Wars People</Text>
                    </Button>
                    <Button success style={styles.buttonContainer}
                            onPress={() => navigate('StarWars', { endpoint: 'planets' })}
                    >
                        <Text>Star Wars Planets</Text>
                    </Button>
                    <Button warning style={styles.buttonContainer}
                            onPress={() => navigate('StarWars', { endpoint: 'starships' })}
                    >
                        <Text>Star Wars Starships</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
        // justifyContent: 'center'
    },
    buttonContainer: {
        margin: 10,
        alignSelf: 'center'
    }
});

export default StackNavigator({
    App: { screen: App },
    Login: { screen: Login },
    Demo: { screen: Demo },
    StarWars: { screen: StarWars },
    Person: { screen: Person }
}, {
    initialRouteName: 'Login'
});
