import { userState } from '@/store/atoms/user';
import { Alert, Button, Card, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';

function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const setUser = useSetRecoilState(userState);

    return <div>
            <div style={{
                paddingTop: 150,
                marginBottom: 10,
                display: "flex",
                justifyContent: "center"
            }}>
                <Typography variant={"h6"}>
                Welcome to Coursera. Sign in below
                </Typography>
            </div>
        <div style={{display: "flex", justifyContent: "center"}}>
            <Card variant={"outlined"} style={{width: 400, padding: 20}}>
                <TextField
                    onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                    }}
                    fullWidth={true}
                    label="Email"
                    variant="outlined"
                    value={email}
                />
                <br/><br/>
                <TextField
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                    }}
                    fullWidth={true}
                    label="Password"
                    variant="outlined"
                    type={"password"}
                    value={password}
                />
                <br/><br/>
                {error ? <><Alert severity="error">{error}</Alert><br/><br/></> : null}

                <Button
                    size={"large"}
                    variant="contained"
                    disabled={loading}
                    onClick={async () => {
                        if (!email.trim() || !password.trim()) {
                            setError("Please enter both email and password.");
                            return;
                        }

                        try {
                            setLoading(true);
                            const res = await axios.post(`/api/admin/login`, {
                                username: email,
                                password: password
                            }, {
                                headers: {
                                    "Content-type": "application/json"
                                }
                            });
                            const data = res.data;

                            localStorage.setItem("token", data.token);
                            setUser({
                                userEmail: email,
                                isLoading: false
                            });
                            router.push("/courses");
                        } catch (err) {
                            setError("Signin failed. Please check your credentials and try again.");
                        } finally {
                            setLoading(false);
                        }
                    }}

                >{loading ? "Signing in..." : "Signin"}</Button>
            </Card>
        </div>
    </div>
}

export default Signin;
