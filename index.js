// index.js
require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = 3000;

// ---------- Supabase client ----------
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// базовий клієнт; для запису при включеному RLS бажано service-role key
const supabase = createClient(supabaseUrl, supabaseKey);

// JSON parser
app.use(express.json());

// ---------------------------
// POST /auth/register
// Creates new user
// ---------------------------
app.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    password.length < 8
  ) {
    return res.status(400).json({
      error: { code: "INVALID_INPUT", message: "Invalid email or password" }
    });
  }

  try {
    // Check if user already exists (by email)
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (selectError && selectError.code !== "PGRST116") {
      // реальна помилка, не "no rows"
      console.error(selectError);
      return res.status(500).json({
        error: { code: "DB_ERROR", message: "Database error" }
      });
    }

    if (existingUser) {
      return res.status(409).json({
        error: { code: "EMAIL_EXISTS", message: "Email already exists" }
      });
    }

    // Insert new user
    // У реальному додатку password треба хешувати, тут спрощено
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        email: email,
        password_hash: password
      })
      .select("id, email")
      .single();

    if (insertError) {
      console.error(insertError);
      return res.status(500).json({
        error: { code: "DB_ERROR", message: "Failed to create user" }
      });
    }

    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: { code: "UNKNOWN_ERROR", message: "Unexpected error" }
    });
  }
});

// ---------------------------
// GET /users
// Get all users
// ---------------------------
app.get("/users", async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, email, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return res.status(500).json({
        error: { code: "DB_ERROR", message: "Failed to fetch users" }
      });
    }

    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: { code: "UNKNOWN_ERROR", message: "Unexpected error" }
    });
  }
});

// ---------------------------
// GET /users/:id
// Get user by ID (UUID from Supabase)
// ---------------------------
app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, created_at")
      .eq("id", userId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error(error);
      return res.status(500).json({
        error: { code: "DB_ERROR", message: "Failed to fetch user" }
      });
    }

    if (!user) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "User not found" }
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: { code: "UNKNOWN_ERROR", message: "Unexpected error" }
    });
  }
});

// ---------------------------
// Start server
// ---------------------------
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
