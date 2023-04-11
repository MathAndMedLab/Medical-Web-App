package com.app.medicalwebapp.services.service_utils;

import org.apache.commons.io.IOUtils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

public class MirfZipUtils {

    public static byte[] createZipArchive(Object inputObject, byte[] fileToProcess, String fileToProcessName) throws IOException {

        //write object to tmp file
        File tempFile = File.createTempFile("serialized-object-", "");
        FileOutputStream fileOutputStream = new FileOutputStream(tempFile.getName());
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(fileOutputStream);
        objectOutputStream.writeObject(inputObject);
        objectOutputStream.flush();
        objectOutputStream.close();

        //zip input object and med data file
        ByteArrayOutputStream zipArchive = new ByteArrayOutputStream();
        ZipOutputStream zipOut= new ZipOutputStream(zipArchive);
        ZipEntry zipEntry1 = new ZipEntry("input");
        zipOut.putNextEntry(zipEntry1);
        zipOut.write(IOUtils.toByteArray(new FileInputStream(tempFile.getName())));
        zipOut.closeEntry();
        ZipEntry zipEntry2 = new ZipEntry(fileToProcessName);
        zipOut.putNextEntry(zipEntry2);
        zipOut.write(fileToProcess);
        zipOut.closeEntry();
        zipOut.close();

        tempFile.delete();

        return zipArchive.toByteArray();
    }

    public static byte[] unzipResultArchive(byte[] zipInBytes) throws IOException, ClassNotFoundException {
        ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(zipInBytes));
        ZipEntry zipEntry = zis.getNextEntry();

        File tempResultFile = File.createTempFile("pipeline-result", ".pdf");
        while (zipEntry != null) {
            if (zipEntry.getName().contains("input")) {
                Files.copy(zis, tempResultFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
            }
            zipEntry = zis.getNextEntry();
        }
        zis.closeEntry();
        zis.close();

        //byte[] resultFileInBytes = FileUtils.readFileToByteArray(tempResultFile);
        InputStream fileInputStream = new FileInputStream(tempResultFile);
        ObjectInputStream objectInputStream = new ObjectInputStream(fileInputStream);
        List<Byte> resultObject = (List<Byte>)objectInputStream.readObject();
        objectInputStream.close();

        tempResultFile.delete();


        byte[] pdfFileBytes = new byte[resultObject.size()];
        for (int i = 0; i < resultObject.size(); i++) {
            pdfFileBytes[i] = resultObject.get(i);
        }
        return pdfFileBytes;
    }

}
