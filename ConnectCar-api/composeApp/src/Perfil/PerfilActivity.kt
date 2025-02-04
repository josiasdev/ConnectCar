package com.example.connectcar

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

class PerfilActivity : AppCompatActivity() {

    // Lançador para selecionar imagens da galeria
    private val imagePickerLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val selectedImageUri: Uri? = result.data?.data
            if (selectedImageUri != null && ::profileImage.isInitialized) {
                profileImage.setImageURI(selectedImageUri)
            } else {
                // Log ou mensagem de erro caso a imagem não seja selecionada
                println("Erro: Nenhuma imagem selecionada ou ImageView não inicializado.")
            }
        }
    }

    // Variável global para o ImageView de perfil
    private lateinit var profileImage: ImageView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_perfil)

        // Referências aos elementos do layout
        profileImage = findViewById(R.id.profile_image)
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
            if (intent.resolveActivity(packageManager) != null) {
                startActivity(intent)
            } else {
                // Log ou mensagem de erro caso a atividade de destino não exista
                println("Erro: Atividade de destino não encontrada.")
            }
        }

        btnChangePassword.setOnClickListener {
            // Ir para a tela de alteração de senha
            val intent = Intent(this, AlterarSenhaActivity::class.java)
            if (intent.resolveActivity(packageManager) != null) {
                startActivity(intent)
            } else {
                // Log ou mensagem de erro caso a atividade de destino não exista
                println("Erro: Atividade de destino não encontrada.")
            }
        }

        // Ação do ícone de edição para abrir o seletor de imagens
        editIcon.setOnClickListener {
            openImageSelector()
        }
    }

    // Função para abrir o seletor de imagens
    private fun openImageSelector() {
        val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
        imagePickerLauncher.launch(intent)
    }
}

