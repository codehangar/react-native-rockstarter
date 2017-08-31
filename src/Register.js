import React from 'react';
import Expo from 'expo';
import {
    StyleSheet
} from 'react-native';
import {
    Content,
    Button,
    Text,
    Icon,
    Item,
    Input
} from 'native-base/src';
import { NavigationActions } from 'react-navigation';
import API from './utils/api';
import { setItem, storageKeys } from './utils/async-storage';
import BrandedContainer from './BrandedContainer';

export default class Register extends React.Component {
    static navigationOptions = {
        title: 'Register',
        headerLeft: null
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            error: {},
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            password: ''
        };
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
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            username: this.state.username,
            email: this.state.email || '',
            password: this.state.password || '',
            device_id: Expo.Constants.deviceId
        };
        API('/users', {
            method: 'POST',
            body
        }).then((responseJson) => {
            console.log('responseJson', responseJson); // eslint-disable-line no-console
            this.setState({
                isLoading: false
            });
            setItem(storageKeys.AUTH_TOKEN, responseJson.token).then(() => {
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

    render() {
        return (
            <BrandedContainer isLoading={this.state.isLoading} size="md">
                <Content>
                    {this.state.error
                        ? <Text>{this.state.error.message}</Text>
                        : null}
                    <Item error={!!this.hasInputError('first_name')}>
                        <Input placeholder='First Name'
                               value={this.state.first_name}
                               onChangeText={(first_name) => this.setState({ first_name })}/>
                    </Item>
                    <Item error={!!this.hasInputError('last_name')}>
                        <Input placeholder='Last Name'
                               value={this.state.last_name}
                               onChangeText={(last_name) => this.setState({ last_name })}/>
                    </Item>
                    <Item error={!!this.hasInputError('username')}>
                        <Icon name="person"/>
                        <Input placeholder="Username"
                               value={this.state.username}
                               autoCapitalize="none"
                               autoCorrect={false}
                               onChangeText={(username) => this.setState({ username })}/>
                    </Item>
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
                        <Text>REGISTER</Text>
                    </Button>
                    <Button block
                            transparent
                            style={styles.btn}
                            onPress={() => this.props.navigation.navigate('Login')}
                    >
                        <Text>Login</Text>
                    </Button>
                </Content>
            </BrandedContainer>
        );
    }
}

const styles = StyleSheet.create({
    btn: {
        marginTop: 20
    }
});
