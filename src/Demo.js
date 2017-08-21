import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    Image,
    TextInput,
    Button,
    Alert,
    FlatList,
    ListView,
    ActivityIndicator
} from 'react-native';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            isLoading: true
        };
    }

    _onPressButton() {
        Alert.alert('You tapped the button!')
    }

    componentDidMount() {
        return fetch('https://facebook.github.io/react-native/movies.json')
            .then((response) => response.json())
            .then((responseJson) => {
                let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                console.log('responseJson.movies', responseJson.movies); // eslint-disable-line no-console
                this.setState({
                    isLoading: false,
                    dataSource: ds.cloneWithRows(responseJson.movies)
                }, function () {
                    // do something with new state
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        let pic = {
            uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
        };
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <ActivityIndicator/>
                </View>
            );
        }
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Image source={pic} style={{ width: 193, height: 110 }}/>
                    <TextInput
                        style={{ height: 40 }}
                        placeholder="Type here to translate!"
                        onChangeText={(text) => this.setState({ text })}
                    />
                    <Text style={{ padding: 10, fontSize: 42 }}>
                        {this.state.text.split(' ').map((word) => word && '🍕').join(' ')}
                    </Text>
                    <Text>Open up App.js to start working on your app!</Text>
                    <Text>Changes you make will automatically reload.</Text>
                    <Text>Shake your phone to open the developer menu.</Text>
                    <View style={styles.buttonContainer}>
                        <Button
                            onPress={this._onPressButton}
                            title="Press Me"
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            onPress={this._onPressButton}
                            title="Press Me"
                            color="#841584"
                        />
                    </View>
                    <View style={styles.alternativeLayoutButtonContainer}>
                        <Button
                            onPress={this._onPressButton}
                            title="This looks great!"
                        />
                        <Button
                            onPress={this._onPressButton}
                            title="OK!"
                            color="#841584"
                        />
                    </View>
                    <FlatList
                        data={[
                            { key: 'Devin' },
                            { key: 'Jackson' },
                            { key: 'James' },
                            { key: 'Joel' },
                            { key: 'John' },
                            { key: 'Jillian' },
                            { key: 'Jimmy' },
                            { key: 'Julie' }
                        ]}
                        renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
                    />
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={(rowData) => <Text>{rowData.title}, {rowData.releaseYear}</Text>}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        margin: 20
    },
    alternativeLayoutButtonContainer: {
        margin: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44
    }
});
