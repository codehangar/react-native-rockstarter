import React from 'react';
import { connect } from 'react-redux';
import Expo from 'expo';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
    Container,
    Content,
    Spinner,
    Button,
    Card,
    CardItem,
    Body,
    Left,
    Thumbnail,
    Text,
    Icon,
    View
} from 'native-base/src';
import { removeItem, storageKeys } from './utils/async-storage';
import API from './utils/api';
import store from './data/store';
import * as types from './data/action-types';

const deviceWidth = Dimensions.get('window').width;

class Profile extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: `Profile`,
        headerBackTitle: null,
        headerRight: (
            <Button transparent
                    onPress={() => {
                        removeItem(storageKeys.AUTH_TOKEN).then(() => {
                            store.dispatch({
                                type: types.SET_USER,
                                user: {}
                            });
                            const resetAction = NavigationActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.init({ routeName: 'Login' })
                                ]
                            });
                            navigation.dispatch(resetAction);
                        });
                    }}>
                <Text>Logout</Text>
            </Button>
        )
    });

    state = {
        isLoading: false,
        gpsLocation: null,
        profileLocation: null
    };

    async componentWillMount() {
        try {
            const gpsLocation = await this.getGPSLocationAsync();
            const profileLocation = await this.getProfileLocationAsync();
            this.setState({ gpsLocation, profileLocation });
        } catch (error) {
            console.log('error', error); // eslint-disable-line no-console
        }
    }

    getProfileLocationAsync = async () => {
        const response = await API('/location');
        return response.data;
    };

    getGPSLocationAsync = async () => {
        const { Location, Permissions } = Expo;
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            const position = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
            const addressMatches = await Location.reverseGeocodeAsync(position.coords);
            return addressMatches[0];
        } else {
            throw new Error('Location permission not granted');
        }
    };

    getProfileLocationElm = () => {
        if (this.state.isLoading) {
            return <Spinner/>;
        }
        if (this.state.profileLocation && this.state.profileLocation.city && this.state.profileLocation.country) {
            const region = this.state.profileLocation.city !== this.state.profileLocation.state
                ? ', ' + this.state.profileLocation.state
                : '';
            return (
                <View>
                    <Text style={styles.fieldHeading}>Current Shared Location</Text>
                    <Text>{this.state.profileLocation.city}{region}</Text>
                    <Text>{this.state.profileLocation.country}</Text>
                </View>
            );
        }
        return null;
    };

    getGPSLocationElm = () => {
        if (this.state.gpsLocation) {
            const region = this.state.gpsLocation.city !== this.state.gpsLocation.region
                ? ', ' + this.state.gpsLocation.region
                : '';
            return (
                <View>
                    <Text style={styles.fieldHeading}>GPS Location</Text>
                    <Text>{this.state.gpsLocation.name}</Text>
                    <Text>{this.state.gpsLocation.city}{region}</Text>
                    <Text>{this.state.gpsLocation.country}</Text>
                </View>
            );
        }
        return null;
    };

    updateLocation = () => {
        this.setState({ isLoading: true });
        const body = {
            city: this.state.gpsLocation.city,
            state: this.state.gpsLocation.region,
            country: this.state.gpsLocation.country
        };
        API('/location', {
            method: 'POST',
            body
        }).then(async (responseJson) => {
            console.log('responseJson', responseJson); // eslint-disable-line no-console
            const profileLocation = await this.getProfileLocationAsync();
            this.setState({ profileLocation, isLoading: false });
        }).catch((error) => {
            this.setState({ isLoading: false, error: error });
        });
    };

    render() {
        console.log('this.state', this.state); // eslint-disable-line no-console

        return (
            <Container>
                <Content padder>
                    <Card style={{ flex: 0 }}>
                        <CardItem bordered>
                            <Left>
                                <Thumbnail
                                    source={{ uri: 'http://screenrant.com/wp-content/uploads/luke-skywalker-star-wars-a-new-hope.jpg' }}/>
                                <Body>
                                <Text>{this.props.user.first_name} {this.props.user.last_name}</Text>
                                <Text note>{this.props.user.username}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Image
                                resizeMode="cover"
                                source={{ uri: 'http://screenrant.com/wp-content/uploads/luke-skywalker-star-wars-a-new-hope.jpg' }}
                                style={{
                                    alignSelf: 'center',
                                    height: 150,
                                    resizeMode: 'cover',
                                    width: deviceWidth / 1.18,
                                    marginVertical: 5
                                }}
                            />
                            <Text style={styles.fieldHeading}>Email</Text>
                            <Text>{this.props.user.email}</Text>

                            <Text style={styles.fieldHeading}>Shared Location Granularity</Text>
                            <Text>{this.props.user.location_granularity}</Text>

                            {this.getProfileLocationElm()}

                            {this.getGPSLocationElm()}
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button transparent iconLeft
                                        onPress={this.updateLocation}
                                        disabled={!this.state.gpsLocation || this.state.isLoading}>
                                    <Icon name="pin"/>
                                    <Text>Update Current Shared Location</Text>
                                </Button>
                            </Left>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fieldHeading: {
        fontWeight: 'bold',
        marginTop: 10
    }
});

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

export default connect(mapStateToProps)(Profile);
