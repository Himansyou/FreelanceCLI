plugins {
    id("java")
    application
}

group = "org.himansyou"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation("info.picocli:picocli:4.7.6")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.20.1")
    implementation("org.xerial:sqlite-jdbc:3.49.1.0")

    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testImplementation("org.assertj:assertj-core:3.24.2")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

}

tasks.test {
    useJUnitPlatform()
}
application {
    mainClass.set("org.himansyou.Main")
}

