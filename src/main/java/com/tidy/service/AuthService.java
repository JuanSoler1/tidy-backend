package com.tidy.service;

import com.tidy.dto.AuthResponse;
import com.tidy.dto.LoginRequest;
import com.tidy.dto.RegistroRequest;
import com.tidy.model.Usuario;
import com.tidy.repository.UsuarioRepository;
import com.tidy.security.JwUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwUtil jwUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UsuarioRepository usuarioRepository,
                       PasswordEncoder passwordEncoder,
                       JwUtil jwUtil,
                       AuthenticationManager authenticationManager) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwUtil = jwUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse registro(RegistroRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new RuntimeException("Ya existe una cuenta con ese correo");
        }

        Usuario usuario = new Usuario();
        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setCorreo(request.getCorreo());
        usuario.setContrasena(passwordEncoder.encode(request.getContrasena()));

        usuarioRepository.save(usuario);

        String token = jwUtil.generateToken(usuario.getCorreo());
        return new AuthResponse(token, usuario.getId(), usuario.getNombreCompleto(), usuario.getCorreo());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getContrasena())
        );

        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwUtil.generateToken(usuario.getCorreo());
        return new AuthResponse(token, usuario.getId(), usuario.getNombreCompleto(), usuario.getCorreo());
    }
}
