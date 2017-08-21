import React from 'react';
import {
    StyleSheet,
    Image,
    Dimensions,
    View
} from 'react-native';
import {
    Container,
    Content,
    Spinner,
    Button,
    Text,
    Icon,
    Item,
    // View,
    Input
} from 'native-base/src';
import { NavigationActions } from 'react-navigation';
import API from './utils/api';
import { getItem, setItem, removeItem, storageKeys } from './utils/async-storage';
import store from './data/store';
import * as types from './data/action-types';

const background = require('./images/codehangar-transparent.png');
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class Login extends React.Component {
    static navigationOptions = {
        title: 'Login',
        headerLeft: null
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            checkingAuthStatus: true,
            email: '',
            password: ''
        };
    }

    componentDidMount() {
        getItem(storageKeys.AUTH_TOKEN).then((token) => {
            if (token) {
                API('/users').then((responseJson) => {
                    console.log('responseJson', responseJson); // eslint-disable-line no-console
                    store.dispatch({
                        type: types.SET_USER,
                        user: responseJson.data
                    });
                    this.goHome();
                }).catch((error) => {
                    console.log('error', error); // eslint-disable-line no-console
                    removeItem(storageKeys.AUTH_TOKEN).then(() => {
                        this.setState({ checkingAuthStatus: false });
                    });
                });
            } else {
                this.setState({ checkingAuthStatus: false });
            }
        })
    }

    goHome = () => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.init({ routeName: 'Home' })
            ]
        });
        this.props.navigation.dispatch(resetAction)
    };

    login = () => {
        this.setState({
            isLoading: true
        });
        const body = {
            email: this.state.email || '',
            password: this.state.password || ''
        };
        API('/auth', {
            method: 'POST',
            body
        }).then((responseJson) => {
            console.log('responseJson', responseJson); // eslint-disable-line no-console
            this.setState({
                isLoading: false
            });
            setItem(storageKeys.AUTH_TOKEN, responseJson.token).then(() => {
                store.dispatch({
                    type: types.SET_USER,
                    user: responseJson.data
                });
                this.goHome();
            });
        }).catch((error) => {
            this.setState({
                isLoading: false,
                error: error
            });
        });
    };

    hasInputError = (field) => {
        if (this.state.error && this.state.error.errors) {
            const inputErrMessage = this.state.error.errors.find((e) => e.path === field);
            return inputErrMessage
                ? inputErrMessage.message
                : null
        }
        return null;
    };

    wrapLowerContent = (lowerContent) => {
        return (
            <Container>
                <Content contentContainerStyle={styles.container}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.upper}>
                            <Image source={background} style={styles.shadow} resizeMode="contain"/>
                        </View>
                        <View style={styles.lower}>
                            {lowerContent}
                        </View>
                    </View>
                </Content>
            </Container>
        );
    };

    render() {
        if (this.state.isLoading || this.state.checkingAuthStatus) {
            return this.wrapLowerContent(
                <Spinner/>
            );
        }

        return this.wrapLowerContent(
            <View>
                {this.state.error
                    ? <Text>{this.state.error.message}</Text>
                    : null}
                <Item error={!!this.hasInputError('email')}>
                    <Icon name="at"/>
                    <Input placeholder="Email"
                           value={this.state.email}
                           autoCapitalize="none"
                           keyboardType="email-address"
                           autoCorrect={false}
                           onChangeText={(email) => this.setState({ email })}/>
                </Item>
                <Item error={!!this.hasInputError('password')}>
                    <Icon name='unlock'/>
                    <Input placeholder='Password'
                           value={this.state.password}
                           autoCapitalize="none"
                           autoCorrect={false}
                           secureTextEntry={!this.state.showPassword}
                           onChangeText={(password) => this.setState({ password })}/>
                    <Button transparent style={{ paddingBottom: 0 }}
                            onPress={() => this.setState({ showPassword: !this.state.showPassword })}>
                        <Icon name={!this.state.showPassword ? 'eye' : 'eye-off'}/>
                    </Button>
                </Item>
                <Button block
                        style={styles.btn}
                        onPress={this.login}
                >
                    <Text>LOGIN</Text>
                </Button>
                <Button block
                        transparent
                        style={styles.btn}
                        onPress={() => this.props.navigation.navigate('Register')}
                >
                    <Text>Register</Text>
                </Button>
            </View>
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
    input: {
        marginBottom: 20
    },
    btn: {
        marginTop: 20
    }
});
