"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles/Home.module.css";
interface User {
  userid: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
}

export default function Home() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  //Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://18.205.24.210:4001/users");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setUsers(data); // Directly set the users from the response
      setError(null);
    };

    fetchUsers();
  }, []);

  // Type guard to check if an object is a valid User
  const isValidUser = (user: User): user is User => {
    return (
      typeof user === "object" &&
      typeof user.first_name === "string" &&
      typeof user.last_name === "string" &&
      typeof user.email === "string"
    );
  };

  // Handle form submission (rest of the code remains the same)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userData = {
      firstName,
      lastName,
      address,
      phone,
      email,
    };

    try {
      // Send POST request to the backend
      const response = await fetch("http://18.205.24.210:4001/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(userData),
      });

      const data = await response.text();
      console.log("User added:", data);

      // Refetch users after adding a new user
      const usersResponse = await fetch("http://localhost:4001/users");
      const usersData = await usersResponse.json();

      // Validate and filter users
      const validUsers = usersData.filter(isValidUser);
      setUsers(validUsers);

      // Reset form fields
      setFirstName("");
      setLastName("");
      setAddress("");
      setPhone("");
      setEmail("");
    } catch (error) {
      console.error("There was an error adding the user!", error);
    }
  };

  return (
    <div className={styles.container}>
      {error && (
        <div style={{ color: "red", marginBottom: "20px" }}>Error: {error}</div>
      )}

      <h1 className={styles.title}>User Registration</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>

      <h2 className={styles.subtitle}>Users List</h2>
      <ul className={styles.userList}>
        <div className={styles.outeruser}>
          {users.map((user) => (
            <div key={user.userid}>
              {/* Adjust these based on your actual user object structure */}
              <div className={styles.userdetails}>
                <p>
                  <span>First Name:</span> {user.first_name}
                </p>
                <p>
                  <span>Last Name:</span> {user.last_name}
                </p>
                <p>
                  <span>Address:</span> {user.address}
                </p>
                <p>
                  <span>Email:</span> {user.email}
                </p>
                <p>
                  <span>Phone:</span> {user.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ul>
    </div>
  );
}
