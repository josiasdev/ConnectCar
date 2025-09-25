package org.Connect

import kotlinx.serialization.Serializable


data class User(
    val id: Int,
    val name: String,
    val email: String
)
