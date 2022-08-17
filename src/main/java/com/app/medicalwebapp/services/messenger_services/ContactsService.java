package com.app.medicalwebapp.services.messenger_services;

import com.app.medicalwebapp.model.User;
import com.app.medicalwebapp.model.messenger_models.Contact;
import com.app.medicalwebapp.repositories.messenger_repositories.ContactsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContactsService {
    private final ContactsRepository contactsRepository;

    @Autowired
    public ContactsService(ContactsRepository contactsRepository) {
        this.contactsRepository = contactsRepository;
    }

    public Optional<Contact> getByContactsOwner(String contactsOwner) {
        Optional<Contact> contact = Optional.empty();
        try {
            contact = contactsRepository.findByContactsOwner(contactsOwner);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return contact;
    }

    /**
     * Удаление пользователей из спика контактов друг друга.
     */
    public void deleteUsersFromEachOthersContacts(String contactUsername1, String contactUsername2) {
        try {
            Contact contact1 = contactsRepository.findByContactsOwner(contactUsername1).get();
            Contact contact2 = contactsRepository.findByContactsOwner(contactUsername2).get();

            List<User> contacts1 = contact1.getContactsList();
            List<User> contacts2 = contact2.getContactsList();

            // Строчки 41-42: возвращение List без пользователя, которого необходимо было удалить (по сути удаление этого пользователя)
            contacts1 = contacts1.stream().filter(user -> !user.getUsername().equals(contact2.getContactsOwner())).collect(Collectors.toList());
            contacts2 = contacts2.stream().filter(user -> !user.getUsername().equals(contact1.getContactsOwner())).collect(Collectors.toList());

            contact1.setContactsList(contacts1);
            contact2.setContactsList(contacts2);

            contactsRepository.save(contact1);
            contactsRepository.save(contact2);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Contact save(Contact contact) {
        return contactsRepository.save(contact);
    }
}
