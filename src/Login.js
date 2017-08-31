import React from 'react';
import {
    StyleSheet
} from 'react-native';
import {
    Button,
    Text,
    Icon,
    Item,
    View,
    Input
} from 'native-base/src';
import { NavigationActions } from 'react-navigation';
import API from './utils/api';
import { getItem, setItem, removeItem, storageKeys } from './utils/async-storage';
import store from './data/store';
import * as types from './data/action-types';
import BrandedContainer from './BrandedContainer';

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
        API('/login', {
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
            console.log('error', error); // eslint-disable-line no-console
            console.log('error.message', error.message); // eslint-disable-line no-console
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

    render() {
        return (
            <BrandedContainer isLoading={this.state.isLoading || this.state.checkingAuthStatus}>
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
            </BrandedContainer>
        );
    }
}

const styles = StyleSheet.create({
    btn: {
        marginTop: 20
    }
});
