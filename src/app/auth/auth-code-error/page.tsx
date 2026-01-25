export default function AuthCodeError() {
    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Authentication Error</h1>
            <p>There was an error verifying your authentication code.</p>
            <a href="/login">Go back to Login</a>
        </div>
    );
}
