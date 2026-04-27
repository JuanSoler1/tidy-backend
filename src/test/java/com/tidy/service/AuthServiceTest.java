package com.tidy.service;

import com.tidy.dto.AuthResponse;
import com.tidy.dto.LoginRequest;
import com.tidy.dto.RegistroRequest;
import com.tidy.model.Usuario;
import com.tidy.repository.UsuarioRepository;
import com.tidy.security.JwUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UsuarioRepository usuarioRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwUtil jwUtil;
    @Mock private AuthenticationManager authenticationManager;
    @InjectMocks private AuthService authService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombreCompleto("Juan Diego Soler");
        usuario.setCorreo("juan@tidy.com");
        usuario.setContrasena("encriptada123");
    }

    @Test
    void registro_exitoso() {
        RegistroRequest request = new RegistroRequest();
        request.setNombreCompleto("Juan Diego Soler");
        request.setCorreo("juan@tidy.com");
        request.setContrasena("123456");

        when(usuarioRepository.existsByCorreo("juan@tidy.com")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("encriptada123");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);
        when(jwUtil.generateToken("juan@tidy.com")).thenReturn("token123");

        AuthResponse response = authService.registro(request);

        assertNotNull(response);
        assertEquals("token123", response.getToken());
        assertEquals("juan@tidy.com", response.getCorreo());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void registro_correo_duplicado_lanza_excepcion() {
        RegistroRequest request = new RegistroRequest();
        request.setCorreo("juan@tidy.com");

        when(usuarioRepository.existsByCorreo("juan@tidy.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.registro(request));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void login_exitoso() {
        LoginRequest request = new LoginRequest();
        request.setCorreo("juan@tidy.com");
        request.setContrasena("123456");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(usuarioRepository.findByCorreo("juan@tidy.com")).thenReturn(Optional.of(usuario));
        when(jwUtil.generateToken("juan@tidy.com")).thenReturn("token123");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("token123", response.getToken());
    }
}
