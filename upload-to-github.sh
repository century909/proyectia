#!/bin/bash

# Script para subir el repositorio a GitHub

echo "Por favor, crea un token de acceso personal en GitHub en https://github.com/settings/tokens"
echo "Luego, ingresa tu nombre de usuario y token de acceso personal:"

read -p "Nombre de usuario: " username
read -p "Token de acceso personal: " token

# Crear archivo de credenciales
echo "https://$username:$token@github.com/century909/proyectia.git" > ~/github-credentials

# Configurar Git para usar el archivo de credenciales
git config --global credential.helper "store --file=/home/diego/github-credentials"

# Hacer push al repositorio
git push -u origin main