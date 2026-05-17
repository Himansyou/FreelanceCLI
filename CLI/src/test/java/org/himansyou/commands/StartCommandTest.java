package org.himansyou.commands;

import org.junit.jupiter.api.Test;
import picocli.CommandLine;

import java.io.PrintWriter;
import java.io.StringWriter;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Functional test for start command: parses args and runs command.
 */
class StartCommandTest {

    @Test
    void start_command_accepts_project_name() {
        StartCommand cmd = new StartCommand();
        CommandLine cl = new CommandLine(cmd);
        StringWriter out = new StringWriter();
        StringWriter err = new StringWriter();
        cl.setOut(new PrintWriter(out));
        cl.setErr(new PrintWriter(err));

        int exit = cl.execute("start", "my-project");

        assertThat(exit).isEqualTo(0);
        assertThat(out.toString()).contains("my-project");
    }
}
