import React from 'react';
import {
    StyleSheet
} from 'react-native';
import {
    StyleProvider,
    Container,
    Content,
    H1, H2, H3,
    Text,
    Button
} from 'native-base/src';
// import { Button } from 'native-base/src/basic/Button';

export default class Home extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: 'React Native Rockstarter',
        headerRight: (
            <Button transparent
                    onPress={() => navigation.navigate('Profile')}>
                <Text>Profile</Text>
            </Button>
        )
    });

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
