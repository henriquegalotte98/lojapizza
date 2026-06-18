package com.pizzaria.loja.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class UploadService {

    private static final String PASTA = "uploads/";

    public List<String> salvarMultiplas(List<MultipartFile> files) {

        List<String> nomes = new ArrayList<>();

        File pasta = new File(PASTA);
        if (!pasta.exists()) {
            pasta.mkdirs();
        }

        for (MultipartFile file : files) {

            if (file.isEmpty()) continue;

            try {
                String nomeFinal = UUID.randomUUID() + "_" + file.getOriginalFilename();
                File destino = new File(PASTA + nomeFinal);

                file.transferTo(destino);

                nomes.add(nomeFinal);

            } catch (IOException e) {
                throw new RuntimeException("Erro ao salvar imagem: " + e.getMessage());
            }
        }

        return nomes;
    }
}