package org.himansyou.commands;

import org.himansyou.api.ApiClient;
import org.himansyou.storage.LocalStorage;
import org.himansyou.storage.SqliteLocalStorage;
import picocli.CommandLine.Command;
import picocli.CommandLine.Option;
import picocli.CommandLine.Parameters;

import java.util.Scanner;

/**
 * freelance login [email] [--password password] [--api-url url]
 * If email/password not provided, prompts interactively.
 */
@Command(name = "login", description = "Log in to FreelanceCLI backend")
public class LoginCommand implements Runnable {

    @Parameters(index = "0", arity = "0..1", description = "Email")
    String email;

    @Option(names = {"-p", "--password"}, description = "Password (or will prompt)")
    String password;

    @Option(names = {"--api-url"}, description = "API base URL", defaultValue = "https://cliapi.himansyou.online")
    String apiUrl;

    @Override
    public void run() {
        LocalStorage storage = new SqliteLocalStorage();
        storage.initSchema();
        Scanner scanner = new Scanner(System.in);
        String e = email;
        if (e == null || e.isBlank()) {
            System.out.print("Email: ");
            e = scanner.nextLine().trim();
        }
        String p = password;
        if (p == null || p.isBlank()) {
            System.out.print("Password: ");
            p = scanner.nextLine();
        }
        if (e.isBlank() || p.isBlank()) {
            System.err.println("Email and password are required.");
            return;
        }
        ApiClient client = new ApiClient(apiUrl);
        try {
            ApiClient.LoginResult result = client.login(e, p);
            storage.setAuth(result.accessToken(), result.userId());
            System.out.println("Logged in as " + e + " (userId: " + result.userId() + ")");
        } catch (Exception ex) {
            System.err.println("Login failed: " + ex.getMessage());
        }
    }
}
