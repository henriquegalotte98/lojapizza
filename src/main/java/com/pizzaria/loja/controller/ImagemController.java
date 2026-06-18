package com.pizzaria.loja.controller;

import com.pizzaria.loja.service.UploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/imagens")
public class ImagemController {

    private final UploadService uploadService;

    public ImagemController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping("/upload-multiplas")
    public ResponseEntity<List<String>> uploadMultiplas(
            @RequestParam("files") List<MultipartFile> files) {

        if (files.size() > 13) {
            return ResponseEntity.badRequest()
                    .body(List.of("Máximo permitido é 13 imagens"));
        }

        List<String> nomes = uploadService.salvarMultiplas(files);

        return ResponseEntity.ok(nomes);
    }
}