package com.pizzaria.loja.controller;

import com.pizzaria.loja.service.ProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class UploadController {
    private final ProdutoService produtoService;

    public UploadController(ProdutoService produtoService) { this.produtoService = produtoService; }

    @PostMapping
    public ResponseEntity<Map<String, String>> upload(@RequestParam("imagem") MultipartFile file) {
        String nomeArquivo = produtoService.salvarImagem(file);
        // O Front-End usa esse nomeArquivo para atrelar ao cadastro do Produto
        return ResponseEntity.ok(Map.of("imagem", nomeArquivo));
    }
}