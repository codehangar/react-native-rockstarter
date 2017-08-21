import React from 'react';
import {
    StyleSheet,
    Image,
    Dimensions,
    View
} from 'react-native';
import {
    Container,
    Header,
    Content,
    Spinner,
    List,
    ListItem,
    Button,
    H1,
    Card,
    CardItem,
    Body,
    Left,
    Thumbnail,
    Text,
    Right,
    Icon,
    Form,
    Item,
    // View,
    Input,
    Label
} from 'native-base';
import { NavigationActions } from 'react-navigation';

const background = require('./images/codehangar-transparent.png');
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class Login extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    login = () => {
        const body = JSON.stringify({
            email: this.state.email,
            password: this.state.password
        });
        this.setState({
            isLoading: true
        });
        fetch('https://jsonplaceholder.typicode.com/login', {
            method: 'POST',
            body
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('responseJson', responseJson); // eslint-disable-line no-console
                this.setState({
                    isLoading: false
                });

                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.init({ routeName: 'App' })
                    ]
                });
                this.props.navigation.dispatch(resetAction)
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        if (this.state.isLoading) {
            return (
                <Container>
                    <Content contentContainerStyle={styles.container}>
                        <Spinner/>
                    </Content>
                </Container>
            );
        }
        console.log('this.props.navigation', this.props.navigation); // eslint-disable-line no-console
        return (
            <Container>
                <Content contentContainerStyle={styles.container}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.upper}>
                            <Image source={background} style={styles.shadow} resizeMode="contain"/>
                        </View>
                        <View style={styles.lower}>
                            <Item>
                                <Icon active name='person'/>
                                <Input placeholder='Email'
                                       onChangeText={(email) => this.setState({ email })}/>
                            </Item>
                            <Item>
                                <Icon active name='unlock'/>
                                <Input placeholder='Password'
                                       secureTextEntry
                                       onChangeText={(password) => this.setState({ password })}/>
                            </Item>
                            <Button block
                                    style={styles.btn}
                                    onPress={this.login}
                            >
                                <Text>Login</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    upper: {
        flex: 1,
        backgroundColor: '#002b36',
        padding: 20
    },
    lower: {
        flex: 2,
        justifyContent: 'center',
        marginHorizontal: 20
    },
    shadow: {
        flex: 1,
        width: null
    },
    bg: {
        // flex: 1,
        marginTop: deviceHeight / 3,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 30,
        bottom: 0
    },
    input: {
        marginBottom: 20
    },
    btn: {
        marginTop: 20
        // alignSelf: 'center'
    }
});
