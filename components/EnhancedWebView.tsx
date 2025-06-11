import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    Dimensions,
    Text
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import type { WebViewNavigation } from 'react-native-webview';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface EnhancedWebViewProps {
    url: string;
}

export default function EnhancedWebView({ url }: EnhancedWebViewProps) {
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [loading, setLoading] = useState(true);
    const webViewRef = useRef<WebView>(null);
    const isConnected = useNetworkStatus();

    const handleNavigationStateChange = (navState: WebViewNavigation) => {
        setCanGoBack(navState.canGoBack);
        setCanGoForward(navState.canGoForward);
    };

    const goBack = () => {
        if (webViewRef.current && canGoBack) {
            webViewRef.current.goBack();
        }
    };

    const goForward = () => {
        if (webViewRef.current && canGoForward) {
            webViewRef.current.goForward();
        }
    };

    const reload = () => {
        if (webViewRef.current) {
            webViewRef.current.reload();
        }
    };

    const handleError = (syntheticEvent: any) => {
        const { nativeEvent } = syntheticEvent;
        Alert.alert(
            'Connection Error',
            'Unable to load the application. Please check your internet connection.',
            [
                { text: 'Retry', onPress: reload },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    if (isConnected === false) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.offlineContainer}>
                    <Ionicons name="wifi-outline" size={64} color="#C7C7CC" />
                    <Text style={styles.offlineTitle}>No Internet Connection</Text>
                    <Text style={styles.offlineText}>
                        Please check your internet connection and try again.
                    </Text>
                    <TouchableOpacity style={styles.retryButton} onPress={reload}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Empty header spacer */}
            <View style={styles.headerSpacer} />

            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                allowsBackForwardNavigationGestures={true}
                onNavigationStateChange={handleNavigationStateChange}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                onError={handleError}
                userAgent="CondoMobileApp/1.0"
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
            />

            <View style={styles.navigationBar}>
                <TouchableOpacity
                    style={[styles.navButton, !canGoBack && styles.disabledButton]}
                    onPress={goBack}
                    disabled={!canGoBack}
                >
                    <Ionicons name="arrow-back" size={24} color={canGoBack ? "#007AFF" : "#C7C7CC"} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navButton, !canGoForward && styles.disabledButton]}
                    onPress={goForward}
                    disabled={!canGoForward}
                >
                    <Ionicons name="arrow-forward" size={24} color={canGoForward ? "#007AFF" : "#C7C7CC"} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.navButton} onPress={reload}>
                    <Ionicons name="refresh" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // Simple empty spacer header
    headerSpacer: {
        height: '4%',
        backgroundColor: '#fff',
    },
    webview: {
        flex: 1,
    },
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '6%',
        backgroundColor: '#F8F8F8',
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    navButton: {
        padding: 10,
        borderRadius: 20,
        minWidth: 40,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    offlineContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    offlineTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    offlineText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});