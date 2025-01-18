package com.example.connectcar

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class PerfilActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_perfil)

        // Referências aos elementos do layout
        val profileImage: ImageView = findViewById(R.id.profile_image)
        val editIcon: ImageView = findViewById(R.id.edit_icon)
        val tvName: TextView = findViewById(R.id.tv_name)
        val tvEmail: TextView = findViewById(R.id.tv_email)
        val tvPhone: TextView = findViewById(R.id.tv_phone)
        val btnEditProfile: Button = findViewById(R.id.btn_edit_profile)
        val btnChangePassword: Button = findViewById(R.id.btn_change_password)

        // Ações dos botões
        btnEditProfile.setOnClickListener {
            // Ir para a tela de edição do perfil
            val intent = Intent(this, EditarPerfilActivity::class.java)
            startActivity(intent)
        }

        btnChangePassword.setOnClickListener {
            // Ir para a tela de alteração de senha
            val intent = Intent(this, AlterarSenhaActivity::class.java)
            startActivity(intent)
        }

        // Lógica para abrir o seletor de imagem
    private val imagePickerLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val selectedImageUri: Uri? = result.data?.data
            if (selectedImageUri != null) {
                profileImage.setImageURI(selectedImageUri)
            }
        }
    }

    private fun openImageSelector() {
        val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
        imagePickerLauncher.launch(intent)
    }
}
    }
