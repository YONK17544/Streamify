
//AUTH CONTROLLERS
export async function SignUp(req, res) {
    // Logic for signing up a user
    res.send('Sign up successful!');
}

export async function LogIn(req, res) {
    // Logic for logging in a user
    res.send('Login successful!');
}   

export function LogOut(req, res) {
    // Logic for logging out a user
    res.send('Logout successful!');
}