package org.himansyou;

import org.himansyou.commands.*;
import picocli.CommandLine;

@CommandLine.Command(
        name = "freelance",
        mixinStandardHelpOptions = true,
        description = "FreelanceCLI - distributed activity logging and sync",
        subcommands = {
                LoginCommand.class,
                StartCommand.class,
                StopCommand.class,
                ReportCommand.class,
                SyncCommand.class
        }
)
public class Main implements Runnable {

    @Override
    public void run() {
        System.out.println("FreelanceCLI - use 'freelance --help' or 'freelance <command> --help'");
    }

    public static void main(String[] args) {
        int exit = new CommandLine(new Main()).execute(args);
        System.exit(exit);
    }
}